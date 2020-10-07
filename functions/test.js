var axios = require('axios') ;
var redis = require('redis');

exports.handler = async function(event, context, callback){
    const code = event.queryStringParameters.code || null

    console.log('code--->', code)

    console.log('event BOdy-->',event.body)
    
    var config = {
        method: 'post',
        url: 'https://www.linkedin.com/oauth/v2/accessToken?client_id=86ftg6210chpct&client_secret=TyKsNyHF4fvNXvrp&redirect_uri=https%3A%2F%2Fkind-neumann-1df8b5.netlify.app%2F.netlify%2Ffunctions%2Ftest&code='+code+'&grant_type=authorization_code',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded', 
          'Cookie': 'lang=v=2&lang=en-us; bcookie="v=2&2bcc5540-f3ea-4c07-8120-ccd1e23fb787"; bscookie="v=1&2020100704232175576941-b6f7-45ca-8edb-29e9a6abb39eAQErL1PiuuEEtBHz5vV03n8O4Th6nHiS"; lissc=1; lidc="b=OB12:g=3219:u=148:i=1602044680:t=1602089858:s=AQHMYKQCbPsxF4mffBnxVOcs_QFJYBPQ"'
        }
      };
      
      axios(config)
      .then(function (response) {
          try{
            console.log("Accesstoken--->")
            console.log(JSON.stringify(response.data.access_token));
            const client = redis.createClient(19379, 'redis-19379.c52.us-east-1-4.ec2.cloud.redislabs.com', {no_ready_check: true});
            client.auth('72XyYd5nAzYcqr14ePDvlaN8IQgfwmDm', function (err) {
                if (err) throw err;
            });

            client.set("AccessToken", response.data.access_token, redis.print);

            client.on('connect', function() {
                console.log('connected redis');
            });
            client.on('error', function() {
                console.log('Not connected redis error');
            });
            callback(null,{
                statusCode:200,
                body:"Saved accessToken"
            })
          }catch(err){
              console.log('Error Block')
              callback(null,{
                statusCode:500,
                body:"Error !!"
            })
          }
          
          
      })
      .catch(function (error) {
        console.log(error);
      });

    
}


