// Based on the 900 sim on cooking-hacks.com by Alejandro Gallego
// Reworked from from Serial to Software Serial and reformulated for GPS by Lloyd Summers
#include <SoftwareSerial.h>
#define GPS_STRING_SIZE 100

int txPin = 13;//middle of gsm sim908
int rxPin = 12;

char aux_str[100];
char gpsString[GPS_STRING_SIZE];
char phone_number[] = "7588415318";
char IP_address[] = "173.255.197.142";
char port[] = "18152";
char ip_data[40] = "Test string from GPRS shield\r\n";


SoftwareSerial myGSM(rxPin, txPin);

void setup() {
  memset(gpsString, '\0', GPS_STRING_SIZE);
  // put your setup code here, to run once:
  pinMode(txPin, OUTPUT);
  pinMode(rxPin, INPUT); // used to turn on and off GSM

  Serial.begin(115200);
  Serial.println("Initializing...");
  myGSM.begin(9600);


  Serial.println("Connecting..."); // checks for connection I believe

  while ((sendATcommand("AT+CREG?", "+CREG: 0,1", 10000) ||
          sendATcommand("AT+CREG?", "+CREG: 0,5", 10000)) == 0);
  Serial.println("Verfication Complete...");
}

void loop() {
  getGPSCoordinates();
  if (sendATcommand2("AT+CIPMUX=0", "OK", "ERROR", 1000) == 1)
  {
    // Waits for status IP INITIAL
    while (sendATcommand("AT+CIPSTATUS", "INITIAL", 500)  == 0 );
    delay(5000);

    //snprintf(aux_str, sizeof(aux_str), "AT+CSTT=\"%s\",\"%s\",\"%s\"", apn, user_name, password);

    // Sets the APN, user name and password
    /*if (sendATcommand2("AT+CSTT", "OK",  "ERROR", 30000) == 1)
      {*/
    if (sendATcommand("AT+CGDCONT=1,\"IP\",\"www\"", "OK", 10000) == 1) {
    if (sendATcommand("AT+CGACT=1,1", "OK", 10000) == 1) {
        if (sendATcommand("AT+CGATT=1", "OK", 1000) == 1) {
          if (sendATcommand2("AT+CSTT", "OK",  "ERROR", 30000) == 1)
          {// Waits for status IP START
            while (sendATcommand("AT+CIPSTATUS", "START", 500)  == 0 );
            // Brings Up Wireless Connection
            if (sendATcommand2("AT+CIICR", "OK", "ERROR", 30000) == 1)
            {// Waits for status IP GPRSACT
              while (sendATcommand("AT+CIPSTATUS", "GPRSACT", 500)  == 0 );
              delay(5000);
              // Gets Local IP Address
              if (sendATcommand2("AT+CIFSR", ".", "ERROR", 10000) == 1)
              {
                // Waits for status IP STATUS
                while (sendATcommand("AT+CIPSTATUS", "IP STATUS", 500)  == 0 );
                delay(5000);
                Serial.println("Opening TCP");

                snprintf(aux_str, sizeof(aux_str), "AT+CIPSTART=\"TCP\",\"%s\",\"%s\"", IP_address, port);

                // Opens a TCP socket
                if (sendATcommand2(aux_str, "CONNECT OK", "CONNECT FAIL", 30000) == 1)
                {
                  Serial.println("Connected");

                  // Sends some data to the TCP socket
                  sprintf(aux_str, "AT+CIPSEND=%d", strlen(gpsString));
                  if (sendATcommand2(aux_str, ">", "ERROR", 10000) == 1)
                  { //check how to send the data with first \r\n
                    sendATcommand2(gpsString, "SEND OK", "ERROR", 10000);
                  }

                  // Closes the socket
                  sendATcommand2("AT+CIPCLOSE", "CLOSE OK", "ERROR", 10000);
                }
                else
                {
                  Serial.println("Error opening the connection");
                }
              }
              else
              {
                Serial.println("Error getting the IP address");
              }
            }
            else
            {
              Serial.println("Error bring up wireless connection");
            }
          } else {
            Serial.println("Error bring up wireless connection");
          }
        }
        else
        {
          Serial.println("Error activating GPRS");
        }
      } else
      {
        Serial.println("Error activating GPRS");
      }
    }
    else
    {
      Serial.println("Error setting the APN");
    }
  }
  else
  {
    Serial.println("Error setting the single connection");
  }

  sendATcommand2("AT+CIPSHUT", "OK", "ERROR", 10000);
  delay(10000);
}

void dial(char *number) {
  Serial.println("Dialing phone number...");
  sprintf(aux_str, "ATD%s;", number);
  sendATcommand(aux_str, "OK", 10000); // dial
}

int8_t sendATcommand(char* ATcommand, char* expected_answer, unsigned int timeout) {
  uint8_t x = 0, answer = 0;
  char response[GPS_STRING_SIZE];
  unsigned long previous;
  memset(response, '\0', GPS_STRING_SIZE); // initalize string
  delay(100);

  while (myGSM.available() > 0) {
    myGSM.read(); // clears the buffer
  }

  myGSM.println(ATcommand);
  Serial.println(ATcommand);

  x = 0;
  previous = millis();

  do {
    if (myGSM.available() != 0) {
      response[x] = myGSM.read();
      x++;
      if (strstr(response, expected_answer) != NULL) {
        answer = 1;
      }
    }
  } while ((answer == 0) && ((millis() - previous) < timeout));
  Serial.println("Response : ");
  Serial.println(response);
  /*for (int i = 0; i < GPS_STRING_SIZE; i++) {
    gpsString[i] = response[i];
    }*/
  return answer;
}

int8_t sendATcommand2(char* ATcommand, char* expected_answer1,
                      char* expected_answer2, unsigned int timeout) {

  uint8_t x = 0, answer = 0;
  char response[GPS_STRING_SIZE];
  unsigned long previous;
  memset(response, '\0', GPS_STRING_SIZE); // initalize string
  delay(100);

  while (myGSM.available() > 0) {
    myGSM.read(); // clears the buffer
  }

  myGSM.println(ATcommand);
  Serial.println(ATcommand);

  x = 0;
  previous = millis();
  // this loop waits for the answer
  do {
    // if there are data in the UART input buffer, reads it and checks for the asnwer
    if (myGSM.available() != 0) {
      response[x] = myGSM.read();
      x++;
      // check if the desired answer 1  is in the response of the module
      if (strstr(response, expected_answer1) != NULL)
      {
        answer = 1;
      }
      // check if the desired answer 2 is in the response of the module
      else if (strstr(response, expected_answer2) != NULL)
      {
        answer = 2;
      }
    }
  }
  // Waits for the asnwer with time out
  while ((answer == 0) && ((millis() - previous) < timeout));
  Serial.println("Response : ");
  Serial.println(response);
  /*for (int i = 0; i < GPS_STRING_SIZE; i++) {
    gpsString[i] = response[i];
    }*/
  return answer;
}

void getGPSCoordinates() {
  uint8_t x = 0, answer = 0;
  unsigned int timeout = 5000;
  char* expected_answer = "OK";
  unsigned long previous;
  char responseString[GPS_STRING_SIZE];
  memset(gpsString, '\0', GPS_STRING_SIZE); // initalize string
  memset(responseString, '\0', GPS_STRING_SIZE); // initalize string
  delay(100);

  while (myGSM.available() > 0) {
    myGSM.read(); // clears the buffer
  }

  myGSM.println("AT+CGPSINF=32");
  Serial.println("AT+CGPSINF=32");

  x = 0;
  previous = millis();

  do {
    if (myGSM.available() != 0) {
      responseString[x] = myGSM.read();
      x++;
      if (strstr(responseString, expected_answer) != NULL) {
        answer = 1;
      }
    }
  } while ((answer == 0) && ((millis() - previous) < timeout));
  int chractersToExclude = 17, count = 0;
  for (int i = chractersToExclude; i < sizeof(responseString); i++) {
    gpsString[count++] = responseString[i];
  }
  Serial.println("Response : ");
  Serial.println(gpsString);
}

