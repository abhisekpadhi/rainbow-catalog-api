create table buyerOrder
(
    id          bigint auto_increment
        primary key,
    orderId     varchar(45)  null,
    customerId  varchar(45)  null,
    ctxTxnId    varchar(255) null,
    createdAt   bigint       null,
    orderStatus varchar(45)  null,
    refundTerms varchar(45)  null,
    ff          text         null,
    billing     text         null,
    quote       text         null,
    items       text         null,
    extraData   text         null
);

create table farm
(
    id           bigint auto_increment
        primary key,
    farmerId     bigint       null,
    farmName     varchar(48)  null,
    farmLocation varchar(64)  null,
    providerId   varchar(45)  null,
    supportPhone varchar(10)  null,
    supportEmail varchar(255) null,
    rating       int          null,
    extraData    text         null
);

create fulltext index farmName
    on farm (farmName);

create table farmInventory
(
    id           bigint auto_increment
        primary key,
    farmId       bigint      null,
    priceInPaise bigint      null,
    productId    varchar(36) null,
    qty          int         null,
    itemId       varchar(45) null
);

create table farmInventoryLedger
(
    id        bigint auto_increment
        primary key,
    farmId    bigint      null,
    productId varchar(36) null,
    qty       int         null,
    op        varchar(32) null,
    opening   int         null,
    createdAt bigint      null,
    itemId    varchar(45) null
);

create table farmPrefs
(
    id        bigint auto_increment
        primary key,
    farmId    bigint       null,
    prefKey   varchar(48)  null,
    prefValue varchar(255) null
);

create table farmer
(
    id         bigint auto_increment
        primary key,
    farmerName varchar(48) null,
    phone      varchar(10) null
);

create table ondcSubscriberInfo
(
    id            bigint auto_increment
        primary key,
    subscriberId  varchar(255) null,
    uniqueKeyId   varchar(255) null,
    details       text         null,
    currentActive bit          null,
    createdAt     bigint       null
);

create table productCatalog
(
    id                 bigint auto_increment
        primary key,
    productName        varchar(48)   null,
    packSize           varchar(32)   null,
    productDescription varchar(255)  null,
    imageUrl           varchar(1024) null,
    grading            varchar(255)  null,
    variant            varchar(255)  null,
    perishability      varchar(32)   null,
    logisticsNeed      varchar(32)   null,
    coldChain          varchar(32)   null,
    idealDelTat        varchar(32)   null,
    skuId              varchar(36)   null
);

create fulltext index variant
    on productCatalog (variant, productDescription, productName);

create table rating
(
    id       bigint auto_increment
        primary key,
    ctxTxnId varchar(255) null,
    payload  text         null
);

