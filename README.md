# rainbow-catalog
Smart cataloguing system for tech enablement of underserved farmers.

# tech
- api: nodejs & expressjs
- db: mysql

# db schema
- farmer
```shell
id
farmerName
```

- farm
```shell
id
farmerId
farmName
farmLocation
```

- farmPrefs
```shell
id
farmId
prefKey
prefValue
```

- productCatalog
```shell
id
productName
packSize
productDescription
imageUrl
grading
variant
perishability
logisticsNeed
coldChain
idealDelTat
```

- farmInventory
```shell
id
farmId
productId
priceInPaise
qty
```

- farmInventoryLedger
```shell
farmId
productId
qty
op
opening
createdAt
```
