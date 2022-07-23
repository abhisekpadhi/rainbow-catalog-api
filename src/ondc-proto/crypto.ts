import _sodium from 'libsodium-wrappers';
import {AuthHeaderParts, IAuthHeaderParts} from './models';
import {IncomingHttpHeaders} from 'http';
import {getSubscriberPublicKey} from './ondc-subscriber-info-workflows';

export const createSigningString = async (message: string, created?: string, expires?: string) => {
    if (!created) created = Math.floor(new Date().getTime() / 1000).toString();
    if (!expires) expires = (parseInt(created) + (1 * 60 * 60)).toString(); // 1 hour expiry

    await _sodium.ready;

    const sodium = _sodium;
    const digest = sodium.crypto_generichash(64, sodium.from_string(message));
    const digest_base64 = sodium.to_base64(digest, _sodium.base64_variants.ORIGINAL);

    const signing_string =
        `(created): ${created}
(expires): ${expires}
digest: BLAKE-512=${digest_base64}`

    return { signing_string, created, expires };
}

export const signMessage = async (signing_string: string, privateKey: string) => {
    await _sodium.ready;
    const sodium = _sodium;

    const signedMessage = sodium.crypto_sign_detached(
        signing_string,
        sodium.from_base64(privateKey, _sodium.base64_variants.ORIGINAL)
    );
    return sodium.to_base64(signedMessage, _sodium.base64_variants.ORIGINAL);
}

export const createAuthorizationHeader = async (message: object) => {
    const {
        signing_string,
        expires,
        created
    } = await createSigningString(JSON.stringify(message));

    const signature = await signMessage(signing_string, process.env.BPP_PRIVATE_KEY || "");

    const subscriber_id = process.env.BAP_ID;
    const unique_key_id = process.env.BPP_UNIQUE_KEY_ID;
    return `Signature keyId="${subscriber_id}|${unique_key_id}|ed25519",algorithm="ed25519",created="${created}",expires="${expires}",headers="(created) (expires) digest",signature="${signature}"`;
}

export const createKeyPair = async () => {
    await _sodium.ready;
    const sodium = _sodium;

    const { publicKey, privateKey } = sodium.crypto_sign_keypair();
    const publicKey_base64 = sodium.to_base64(publicKey, _sodium.base64_variants.ORIGINAL);
    const privateKey_base64 = sodium.to_base64(privateKey, _sodium.base64_variants.ORIGINAL);

    return { publicKey: publicKey_base64, privateKey: privateKey_base64 };
}

const lookupPublicKey = async (subscriber_id: string, unique_key_id: string) => {
    return getSubscriberPublicKey(subscriber_id, unique_key_id);
}

const remove_quotes = (a: string) => {
    return a.replace(/^["'](.+(?=["']$))["']$/, '$1');
}

const split_auth_header = (auth_header: string) => {
    const header = auth_header.replace('Signature ', '');
    const re = /\s*([^=]+)=([^,]+)[,]?/g;
    let m;
    const parts: { [k: string]: string } = {}
    while ((m = re.exec(header)) !== null) {
        if (m) {
            parts[m[1]] = remove_quotes(m[2]);
        }
    }
    return new AuthHeaderParts(parts as IAuthHeaderParts);
}

const verifyMessage = async (signedString: string, signingString: string, publicKey: string) => {
    try {
        await _sodium.ready;
        const sodium = _sodium;
        return sodium.crypto_sign_verify_detached(sodium.from_base64(signedString, _sodium.base64_variants.ORIGINAL), signingString, sodium.from_base64(publicKey, _sodium.base64_variants.ORIGINAL));
    } catch (error) {
        return false
    }
}

const verifyHeader = async (headerParts: AuthHeaderParts, body: object, public_key: string) => {
    if (headerParts.data === undefined) {
        return false
    }
    const { signing_string } = await createSigningString(JSON.stringify(body), headerParts.data['created'], headerParts.data['expires']);
    return await verifyMessage(headerParts.data['signature'], signing_string, public_key);
}

export const isSignatureValid = async (headerString: string, body: object) => {
    try{
        const headerParts = split_auth_header(headerString);
        const keyIdSplit = headerParts.data?.['keyId'].split('|')
        const subscriber_id = keyIdSplit && keyIdSplit[0];
        const keyId = keyIdSplit && keyIdSplit[1]
        if (keyId === undefined || subscriber_id === undefined) {
            return false;
        }
        const public_key = await lookupPublicKey(subscriber_id, keyId)
        if (public_key === null) {
            return false
        }
        return await verifyHeader(headerParts, body, public_key)
    } catch(e){
        return false
    }
}

export const isAlgoValid = (headerString: string) => {
    if (headerString === null) {
        return false
    }

    // check algorithm
    const parts = split_auth_header(headerString);
    if (parts.data === undefined) {
        return false
    }
    return parts.data.algorithm === parts.data.keyId.split('|')[2];

}

export const isRequestValid = async (headers: IncomingHttpHeaders, body: any) => {
    // if BG forwarded request, use X-Gateway-Authorization header, if BPP request, use Authorization header
    const headerString = ('Authorization' in headers ? headers['Authorization'] : headers['X-Gateway-Authorization']) as string;

    // check for valid algo and signature
    return isAlgoValid(headerString) && await isSignatureValid(headerString, body);
}
