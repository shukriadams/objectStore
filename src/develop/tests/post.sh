JSON='{ "foo" : "bar", "baz" : { "woz" : "j1ob",  "foo" : "thing" } }'
KEY=myindex


curl \
    -X POST \
    -H "Content-Type: application/json" \
    -d "${JSON}" \
    http://localhost:5000/v1/item/$KEY?tags=123,thing,,test




