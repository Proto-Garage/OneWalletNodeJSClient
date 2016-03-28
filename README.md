# One Wallet Client (NodeJS)

The client will be used for making requests with the One Wallet Service.

```http
Authorization: OW {providerAccessId}:{requestSignature}
```
The client is implemented with the authorization header security and resending of requests for convenience.

## Getting Started

```javascript
import OneWalletServiceAPI from 'onewallet-client-node';

/* Use the constructor to setup */
let client = new OneWalletServiceAPI({
    accessId: 'SAMPLE_PROVIDER',
    secretKey: 'X6VYZBFRS8qrqhwg28eQbyEcZmTSrE9G'
});

/* Or use applyConfig to setup */
let client = new OneWalletServiceAPI();
client.applyConfig({
   accessId: 'SAMPLE_PROVIDER',
   secretKey: 'X6VYZBFRS8qrqhwg28eQbyEcZmTSrE9G'
});

```

To get started, first you must have the `accessId` and the `secretKey` values that will be given by the operator respectively. 
Use the `constructor` or `applyConfig()` accordingly and now you can use the **One Wallet Client API**.

## One Wallet Client API
### constructor ( )

The OneWalletServiceAPI constructor accepts object input and can be adjusted using the options specified below.

#### Input (Options)
```javascript
{
    baseUrl: 'https://api.as2bet.com',
    accessId: '',
    secretKey: '',
    backoffInitialDelay: 50,
    timeout: 3000
}
```

| Field | Required | Type | Description | Default |
|---|---|---|---|---|
| baseUrl | false | String | One wallet service base url | https://api.as2bet.com |
| accessId | true | String | Service access id | |
| secretKey | true | String | Service secret key | |
| backoffInitialDelay | false | Number | Delay for request retry | 50 |
| timeout | false | Number | request timeout | 3000 |

### authenticateUser ( )

This API will check the user's credentials and returns the user's information.

#### Input
```javascript
{
    username: 'test_user1',
    password: 'pass'
}
```

| Field | Required | Type | Description | Default |
|---|---|---|---|---|
| username | true | String | User's username | |
| password | true | String | User's password | | 

#### Return Value
```javascript
{
    userId: '56',
    balance: 250000.0000,
    nickname: 'zenoan',
    birthday: '1991-01-21',
    currency: 'USD',
    firstName: 'Elon',
    lastName: 'Musk',
    email: 'elonmusk@spacex.com'
}
```

### createGameSession ( )

This API creates a player game session. A player can have only one active session.
This will accept `userId` as input and returns a `sessionId`.

#### Input
```javascript
{
    userId: '56'
}
```

| Field | Required | Type | Description | Default |
|---|---|---|---|---|
| userId | true | String | User's id | |

#### Return Value
```javascript
{
    sessionId: '0ee89b10-e987-11e5-8b12-e5f8552670cc'
}
```

### getUserInfo ( )

This API retrieves the player's information give it's id and the fields you want to retrieve.

#### Input
```javascript
{
    userId: '56',
    fields: [ 'balance', 'currency', 'username', 'nickname', 'firstName', 'lastName', 'birthday', 'email' ]
}
```

| Field | Required | Type | Description | Default |
|---|---|---|---|---|
| userId | true | String | User's id | |
| fields | true | Array | Fields to be retrieved | [ 'balance', 'currency', 'username', 'nickname', 'firstName', 'lastName', 'birthday', 'email' ] |

#### Return Value
```javascript
{
    balance: 250000.0000,
    nickname: 'zenoan',
    birthday: '1991-01-21',
    currency: 'USD',
    firstName: 'Elon',
    lastName: 'Musk',
    email: 'elonmusk@spacex.com'
}
```

### Transfer Transaction

The **One Wallet Service** has its own flow of transfer mechanism. A normal transaction mechanism would consists of a `BET` and 
`RESULT` requests, it always starts with the `BET` transaction and ends with either `RESULT` OR `CANCEL` transactions. 
Transfer transactions are **idempotent**. Every transfer transaction flow has a unique `referenceId`, every transaction 
has a unique `transactionId`, and every transaction returns the user's current balance.

### bet ( )

This API will make a `BET` transaction for a particular game and starts a transfer transaction flow with a `referenceId`.
 
#### Input
```javascript
{
    userId: '56',
    sessionId: '0ee89b10-e987-11e5-8b12-e5f8552670cc',
    referenceId: 'c5c6ae90-e986-11e5-8b12-e5f8552670cc',
    betAmount: 58.0000
    // ...
}
```

| Field | Required | Type | Description | Default |
|---|---|---|---|
| userId | true | String | User's id | |
| sessionId | true | String | Game session ID. Generate using the `createGameSession ( )` API | |
| referenceId | true | String | Game reference [UUID](https://tools.ietf.org/html/rfc4122). | |
| betAmount | true | Number | Bet transaction value | |
| ... | false | | Provider specific key-value inputs (you can add it here). | |

#### Return Value
```javascript
{
    balance: 249942.0000
    currency: 'USD'
}
```

### result ( )

This API will make a `RESULT` transaction for a particular game after a `BET` transaction with the same `referenceId`.

#### Input
```javascript
{
    userId: '56',
    sessionId: '0ee89b10-e987-11e5-8b12-e5f8552670cc',
    referenceId: 'c5c6ae90-e986-11e5-8b12-e5f8552670cc',
    winloss: -58.0000
    // ...
}
```

| Field | Required | Type | Description | Default |
|---|---|---|---|
| userId | true | String | User's id | |
| sessionId | true | String | Game session ID. Generate using the `createGameSession ( )` API | |
| referenceId | true | String | Game reference [UUID](https://tools.ietf.org/html/rfc4122). | |
| winloss | true | Number | Win or lose amount. User cannot lose more than the betAmount. | |
| ... | false | | Provider specific key-value inputs (you can add it here). | |

#### Return Value
```javascript
{
    balance: 249942.0000
    currency: 'USD'
}
```

### cancel ( )

This API will cancel a `BET` transaction with the same `referenceId`.

#### Input
```javascript
{
    userId: '56',
    sessionId: '0ee89b10-e987-11e5-8b12-e5f8552670cc',
    referenceId: 'c5c6ae90-e986-11e5-8b12-e5f8552670cc',
    // ...
}
```

| Field | Required | Type | Description | Default |
|---|---|---|---|
| userId | true | String | User's id | |
| sessionId | true | String | Game session ID. Generate using the `createGameSession ( )` API | |
| referenceId | true | String | Game reference [UUID](https://tools.ietf.org/html/rfc4122). | |
| ... | false | | Provider specific key-value inputs (you can add it here). | |


#### Result Value
```javascript
{
    balance: 249942.0000
    currency: 'USD'
}
```
