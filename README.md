# Lightning Singles

Lightning Singles is a directory service for channel liquidity matchmaking on the Bitcoin Lightning Network. Submit your node information and ask the community to connect. 

By default, Singles charges 100 satoshis to verify a post. Posts expire after 3 days.

~~A mainnet instance is running at `singles.shock.network/api` with a [frontend](https://github.com/shocknet/singles-fe) available at https://Singles.Shock.Network~~ 

## API

Lightning Singles provides two API's, one for posting a request and another for listing "active" requests.

##### SHILL

This post requires `Id:` as a string with a length of 66, `Ip:` as a valid Ip4 or Ip6 address, and `Port:` as an integer. Failing any of these requirements returns a 400: Invalid value(s) detected. 

Example in Node:

```js
var request = require("request");

var options = { method: 'POST',
  url: 'https://singles.shock.network/api/shill/',
  headers: { 'content-type': 'application/json' },
  body:
   { Id:
      'Somekey19d742ca294a55c00376b3b355c3c90d61c6b6b39554dbc7ac19b14supg',
     Ip: '8.8.8.8',
     Port: 9735,
     Why: 'My super awesome lightning store needs love',
     Wumbo: false },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body); // is a BOLT11 Invoice
});
```

Example from our [React Frontend](https://github.com/shocknet/singles-fe) using Fetch:
```js
  handleSubmit() {
    const myShill = JSON.stringify({Id: this.state.Id, Ip: this.state.Ip, Port: this.state.Port, Why: this.state.Why, Wumbo: this.state.Wumbo});
    fetch('https://singles.shock.network/api/shill', {
      method: 'POST', headers: {'content-type': 'application/json'}, body: myShill
    })
      .then(res => res.text())
      .then(
        (result) => {
          this.setState({
            invoice: result, 
          })
        }
      )
      .catch(error => console.error('Error:', error.text()))
  }
```
##### LIST

```js
var request = require("request");

var options = { method: 'GET', url: 'https://singles.shock.network/api/list' };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  console.log(body); // array of listings
});
```
