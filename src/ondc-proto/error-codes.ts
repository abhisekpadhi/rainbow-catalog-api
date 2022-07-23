export const ONDC_ERROR_CODES = {
    "Gateway": {
        "10000": {
            "Code": 10000,
            "Type": "Gateway",
            "Message": "Bad or Invalid request error",
            "Description": "Generic bad or invalid request error"
        },
        "10001": {
            "Code": 10001,
            "Type": "Gateway",
            "Message": "Invalid Signature",
            "Description": "Cannot verify signature for request"
        },
        "10002": {
            "Code": 10002,
            "Type": "Gateway",
            "Message": "Invalid City Code",
            "Description": "Valid city code needs to be passed for search"
        }
    },
    "Buyer App": {
        "20000": {
            "Code": 20000,
            "Type": "Buyer App",
            "Message": "Invalid catalog item",
            "Description": "Catalog Item cannot be displayed as it does not meet statutory requirements"
        },
        "20001": {
            "Code": 20001,
            "Type": "Buyer App",
            "Message": "Invalid Signature",
            "Description": "Cannot verify signature for request"
        }
    },
    "Seller App": {
        "30000": {
            "Code": 30000,
            "Type": "Seller App",
            "Message": "Invalid request error",
            "Description": "Generic invalid request error"
        },
        "30001": {
            "Code": 30001,
            "Type": "Seller App",
            "Message": "Provider not found",
            "Description": "When Seller App is unable to find the provider id sent by the Buyer App"
        },
        "30002": {
            "Code": 30002,
            "Type": "Seller App",
            "Message": "Provider location not found",
            "Description": "When Seller App is unable to find the provider location id sent by the Buyer App"
        },
        "30003": {
            "Code": 30003,
            "Type": "Seller App",
            "Message": "Provider category not found",
            "Description": "When Seller App is unable to find the provider category id sent by the Buyer App"
        },
        "30004": {
            "Code": 30004,
            "Type": "Seller App",
            "Message": "Item not found",
            "Description": "When Seller App is unable to find the item id sent by the Buyer App"
        },
        "30005": {
            "Code": 30005,
            "Type": "Seller App",
            "Message": "Category not found",
            "Description": "When Seller App is unable to find the category id sent by the Buyer App"
        },
        "30006": {
            "Code": 30006,
            "Type": "Seller App",
            "Message": "Offer not found",
            "Description": "When Seller App is unable to find the offer id sent by the Buyer App"
        },
        "30007": {
            "Code": 30007,
            "Type": "Seller App",
            "Message": "Add-on not found",
            "Description": "When the Seller App is unable to find the add-on id sent by the Buyer App"
        },
        "30008": {
            "Code": 30008,
            "Type": "Seller App",
            "Message": "Fulfillment unavailable",
            "Description": "When Seller App is unable to find the fulfillment id sent by the Buyer App"
        },
        "30009": {
            "Code": 30009,
            "Type": "Seller App",
            "Message": "Fulfilment provider unavailable",
            "Description": "When the Seller App is unable to find fulfilment provider id sent by the Buyer App"
        },
        "30010": {
            "Code": 30010,
            "Type": "Seller App",
            "Message": "Order not found",
            "Description": "When the Seller App is unable to find the order id sent by the Buyer App"
        },
        "30011": {
            "Code": 30011,
            "Type": "Seller App",
            "Message": "Invalid cancellation reason",
            "Description": "When the Seller App is unable to find the cancellation reason in cancellation_reason_id"
        },
        "30012": {
            "Code": 30012,
            "Type": "Seller App",
            "Message": "Invalid update_target",
            "Description": "When the Seller App is unable to find the update_target in the order object"
        },
        "30013": {
            "Code": 30013,
            "Type": "Seller App",
            "Message": "Update inconsistency",
            "Description": "When the Seller App finds changes in the order object other than the update_target"
        },
        "30014": {
            "Code": 30014,
            "Type": "Seller App",
            "Message": "Entity to rate not found",
            "Description": "When the Seller App is unable to find the entity to rate in id"
        },
        "30015": {
            "Code": 30015,
            "Type": "Seller App",
            "Message": "Invalid rating value",
            "Description": "When the Seller App receives an invalid value as the rating value in value"
        },
        "30016": {
            "Code": 30016,
            "Type": "Seller App",
            "Message": "Invalid Signature",
            "Description": "Cannot verify signature for request"
        },
        "40000": {
            "Code": 40000,
            "Type": "Seller App",
            "Message": "Business Error",
            "Description": "Generic business error"
        },
        "40001": {
            "Code": 40001,
            "Type": "Seller App",
            "Message": "Action not applicable",
            "Description": "When an API endpoint is not implemented by the Seller App as it is not required for their use cases and a Buyer App calls one of these endpoints"
        },
        "40002": {
            "Code": 40002,
            "Type": "Seller App",
            "Message": "Item quantity unavailable",
            "Description": "When the Seller App is unable to select the specified number in order.items].quantity"
        },
        "40003": {
            "Code": 40003,
            "Type": "Seller App",
            "Message": "Quote unavailable",
            "Description": "When the quote sent by the Buyer App is no longer available from the Seller App"
        },
        "40004": {
            "Code": 40004,
            "Type": "Seller App",
            "Message": "Payment not supported",
            "Description": "When the payment object sent by the Buyer App is not supported by the Seller App"
        },
        "40005": {
            "Code": 40005,
            "Type": "Seller App",
            "Message": "Tracking not supported",
            "Description": "When the Seller App does not support tracking for the order in order_id"
        },
        "40006": {
            "Code": 40006,
            "Type": "Seller App",
            "Message": "Fulfilment agent unavailable",
            "Description": "When an agent for fulfilment is not available"
        },
        "50000": {
            "Code": 50000,
            "Type": "Seller App",
            "Message": "Policy Error",
            "Description": "Generic Policy Error"
        },
        "50001": {
            "Code": 50001,
            "Type": "Seller App",
            "Message": "Cancellation not possible",
            "Description": "When the Seller App is unable to cancel the order due to it's cancellation policy"
        },
        "50002": {
            "Code": 50002,
            "Type": "Seller App",
            "Message": "Updation not possible",
            "Description": "When the Seller App is unable to update the order due to it's updation policy"
        },
        "50003": {
            "Code": 50003,
            "Type": "Seller App",
            "Message": "Unsupported rating category",
            "Description": "When the Seller App receives an entity to rate which is not supported"
        },
        "50004": {
            "Code": 50004,
            "Type": "Seller App",
            "Message": "Support unavailable",
            "Description": "When the Seller App receives an object if for which it does not provide support"
        }
    },
    "Logistics": {
        "60001": {
            "Code": 60001,
            "Type": "Logistics",
            "Message": "Location Serviceability Error",
            "Description": "Pickup or Dropoff locations not serviceable by Logistics Provider"
        },
        "60002": {
            "Code": 60002,
            "Type": "Logistics",
            "Message": "Order Serviceability Error",
            "Description": "Order not serviceable as Logistics Agents not available"
        },
        "60003": {
            "Code": 60003,
            "Type": "Logistics",
            "Message": "Invalid Signature",
            "Description": "Cannot verify signature for request"
        }
    }
}
