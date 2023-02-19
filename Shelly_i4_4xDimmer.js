

 /**
 * @copyright shelly-tools contributors
 * @license   GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0.de.html)
 * @author    U.Heynen
 *
 * This script is intended to remote control up to 4 Shelly Dimmer / Dimmer2 and emulates the locally conencted button.
 * short_press  = on/off toggle,
 * double_press = on with 50% brightness,
 * triple_press = on with 100% brightness,
 * long_press   = cylclic dimming 
 */

// CONFIG START
// IP address / hostname from Shelly Dimmer device
let NoButtons = 4;
let REMOTE = [ 
   {ip: 'admin:password@192.168.178.20' }, // User:Password@IP-Address of first  button Shelly Dimmer 
   {ip: 'admin:password@192.168.178.21' }, // User:Password@IP-Address of second button Shelly Dimmer 
   {ip: 'admin:password@192.168.178.22' }, // User:Password@IP-Address of third  button Shelly Dimmer 
   {ip: 'admin:password@192.168.178.23' }, // User:Password@IP-Address of fourth button Shelly Dimmer 
];
// CONFIG END 

let dim =[ false, false, false, false, ];
let up = [ false, false, false, false, ];

// add an evenHandler for button type input and various push events
Shelly.addEventHandler
( 
    function (event, user_data)
    {
        print(JSON.stringify(event));
        if (typeof event.info.event !== 'undefined') 
      {   
          let i = event.info.id ; 
          if(i >=0 && i < NoButtons   )
          {
            if ( event.info.event === 'btn_up') {
            
              if(dim[i] === true )
              {
                dim[i] = false;
                print("release");
                Shelly.call(
                    "http.get", {
                    url: 'http://' + REMOTE[i].ip + '/light/0?dim=stop'
                },
                    function (response, error_code, error_message, ud) { },
                    null
                );
              }
            }

            if (event.info.event === 'single_push' ) {                
                Shelly.call(
                    "http.get", {
                    url: 'http://' + REMOTE[i].ip + '/light/0?turn=toggle'
                },
                    function (response, error_code, error_message, ud) { },
                    null
                );
            } else if (event.info.event === 'double_push') {
                Shelly.call(
                    "http.get", {
                    url: 'http://' + REMOTE[i].ip + '/light/0?turn=on&brightness=50'
                },
                    function (response, error_code, error_message, ud) { },
                    null
                );
            } else if (event.info.event === 'triple_push' ) {
                Shelly.call(
                    "http.get", {
                    url: 'http://' + REMOTE[i].ip + '/light/0?turn=on&brightness=100'
                },
                    function (response, error_code, error_message, ud) { },
                    null
                );                
            } else if (event.info.event === 'long_push') {
                dim[i] = true;

                if (up[i] === true) {
                    up[i] = false;
                    Shelly.call(
                        "http.get", {
                        url: 'http://' + REMOTE[i].ip + '/light/0?dim=down&step=100'
                    },
                        function (response, error_code, error_message, ud) { },
                        null
                    );

                } else {
                    up[i] = true;
                    Shelly.call(
                        "http.get", {
                        url: 'http://' + REMOTE[i].ip + '/light/0?dim=up&step=100'
                    },
                        function (response, error_code, error_message, ud) { },
                        null
                    );

                }
                print("cycle");


            } else {
                return true;
            }
          }        
        } else {
            return true;
        }
    
    },
);