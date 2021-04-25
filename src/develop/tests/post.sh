JSON='{ "foo" : "bar" }'

curl \
    -X POST \
    -H "Content-Type: application/json" \
    -d "${JSON}" \
    http://localhost:5000/v1/item/123




