# One Wallet Client (NodeJS)

The `One Wallet Client` will be used for making requests into the `One Wallet Service API`.

## Getting Started

```javascript
/* Example usage */
import OneWalletServiceAPI from 'onewallet-client-node';

/* Use the constructor to setup */
let client = new OneWalletServiceAPI( {
    accessId: 'SAMPLE_PROVIDER',
    secretKey: 'X6VYZBFRS8qrqhwg28eQbyEcZmTSrE9G'
} );
```
The `accessId` and the `secretKey` will be provided by the operator.

## One Wallet Client API
### `constructor ( )`

The OneWalletServiceAPI constructor accepts an object with the following properties:


| Field | Required | Type | Description | Default |
|---|---|---|---|---|
| baseUrl | false | String | One wallet service base url | https://api.as2bet.com |
| accessId | true | String | Service access id | |
| secretKey | true | String | Service secret key | |
| backoffInitialDelay | false | Number | Delay for request retry | 50 |
| timeout | false | Number | request timeout | 3000 |

#### Input (Options)
```javascript
{
    baseUrl: 'https://api.as2bet.com',
    accessId: 'SAMPLE_PROVIDER',
    secretKey: 'X6VYZBFRS8qrqhwg28eQbyEcZmTSrE9G',
    backoffInitialDelay: 50,
    timeout: 3000
}
```

### `authenticateUser ( )`

This method will check the user's credentials and returns the user's information.

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

### `createGameSession ( )`

This method creates a player game session.
This method accepts a `userId` as input and returns a `sessionId`.

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

### `getUserInfo ( )`

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

### Transfer Transactions

### `debit ( )`

This method creates a `DEBIT` transaction for a specified game type.

#### Input
```javascript
{
    userId: '56',
    sessionId: '0ee89b10-e987-11e5-8b12-e5f8552670cc',
    roundId: '43524335',
    amount: 58,
    gameType: 'Six Card Chinese',
    ...
}
```

| Field | Required | Type | Description | Default |
|---|---|---|---|---|
| userId | true | String | User's id | |
| sessionId | true | String | Game session ID. Generate using the `createGameSession ( )` API | |
| roundId | true | String | Round Id | |
| amount | true | Number | Debit transaction amount | |
| gameType | true | String | Game type | |
| ... | false | | Provider specific key-value inputs (you can add it here). | |

#### Return Value
```javascript
{
    balance: 249942.0000
    currency: 'USD'
}
```

### `credit ( )`

This method creates a `CREDIT` transaction for a specified game type.

#### Input
```javascript
{
    userId: '56',
    sessionId: '0ee89b10-e987-11e5-8b12-e5f8552670cc',
    roundId: '43524335',
    amount: 58,
    gameType: 'Six Card Chinese',
    ...
}
```

| Field | Required | Type | Description | Default |
|---|---|---|---|---|
| userId | true | String | User's id | |
| sessionId | true | String | Game session ID. Generate using the `createGameSession ( )` API | |
| roundId | true | String | Round Id | |
| amount | true | Number | Debit transaction amount | |
| gameType | true | String | Game type | |
| ... | false | | Provider specific key-value inputs (you can add it here). | |

#### Return Value
```javascript
{
    balance: 249942
    currency: 'USD'
}
```

### `cancelDebit ( )`

This method will cancel a `DEBIT` transaction with the specified `transactionId`.

#### Input
```javascript
{
    userId: '56',
    sessionId: '0ee89b10-e987-11e5-8b12-e5f8552670cc',
    debitTransactionId: 'c5c6ae90-e986-11e5-8b12-e5f8552670cc',
    gameType: 'Six Card Chinese',
    ...
}
```

| Field | Required | Type | Description | Default |
|---|---|---|---|---|
| userId | true | String | User's id | |
| sessionId | true | String | Game session ID. Generate using the `createGameSession ( )` API | |
| debitTransactionId | true | String | Debit transaction ID [UUID](https://tools.ietf.org/html/rfc4122). | |
| gameType | true | String | Game type | |
| ... | false | | Provider specific key-value inputs (you can add it here). | |


#### Result Value
```javascript
{
    balance: 249942
    currency: 'USD'
}
```
