$(document).ready(function() {

  let __results = $("#results");
  const __apiKey = "b045804ab93431828b3e101e2be26dc1";

  $("form").submit(function (e) {
    let __lat = $(this).find("[name=lat]").val();
    let __long = $(this).find("[name=long]").val();

    $.ajax({
      url: `https://api.open-meteo.com/v1/forecast?latitude=${__lat}&longitude=${__long}&hourly=temperature_2m`,
      type: 'GET',
      dataType: 'JSON',
    
      beforeSend: () => {
        __results.text('Sending Request... Please Wait');
      },
    
      success:() => {
        __results.text('Request Sent... Waiting for response');
      },
    
      complete: ( response ) => {
    
        if ( response.status !== 404 && response.statusText !== "error" ) {
          let __data = response.responseText;
    
          if ( __data !== "" ) {
            __data = JSON.parse(__data);

            let __secondResponse = `https://api.openweathermap.org/data/2.5/weather?lat=${__data.latitude}&lon=${__data.longitude}&appid=${__apiKey}`;

            $.ajax({
              type: "GET",
              url: __secondResponse,
              dataType: "JSON",
              complete: function (response) {
                if ( response.status !== 404 && response.statusText !== 'error' ) {
                  if ( response.responseText !== "" ) {
                    let __realData = JSON.parse(response.responseText);

                    let __weather = __realData.weather[0];
                      let __weatherMain = __weather.main;
                      let __weatherDesc = __weather.description;
                    

                    let __main = __realData.main;
                      let __mainTemp = __main.temp;
                    

                    let __mainInfo = __realData.sys;
                      let __country = __mainInfo.country;
                      let __sunrise = __mainInfo.sunrise;
                      let __sunset = __mainInfo.sunset;

                    
                      __results.html('');

                    
                    __results.append(`
                        <div class="border border-gray-300 p-2 grid grid-cols-3 gap-5 w-full text-sm">
                            <span><b>Country</b> : ${__country}</span>
                            <span><b>Sunrise</b> : ${__sunrise}</span>
                            <span><b>Sunset</b> : ${__sunset}</span>
                            <span><b>Description</b> : ${__weatherDesc}</span>
                            <span><b>Temperature</b> : ${__mainTemp}</span>
                        </div>
                    `);

                  }
                }
              }
            });
          }
        }
        else {
          if ( response.statusText === "error" ) {
            console.log('Please check your internet conection');
          }
          else {
            if ( response.status === 404 ) {
              console.log('An Error Occured. Please Try Again Later');
            }
          }
        }
      },
    
    
      error: (err) => {
        console.log('Internal Server Error');
      }
    });


    e.preventDefault();
    e.stopPropagation();

    return false;

  });
});