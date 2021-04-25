# fail on errors
set -e

# defaults
DOCKERPUSH=0
SMOKETEST=0
CONTAINERNAME=shukriadams/objectstore
BUILDCONTAINER=shukriadams/node12build:0.0.3
SMOKETESTSCRIPT=./smoketest.sh

while [ -n "$1" ]; do 
    case "$1" in
    --dockerpush) DOCKERPUSH=1 ;;
    --smoketest) SMOKETEST=1 ;;
    esac 
    shift
done

rm -rf .clone 
mkdir -p .clone     

cp -R  ./../src  .clone 

# cleans up local node_modules, this is for building on dev systems, on CI it has no effect
rm -rf .clone/src/node_modules

# get tag fom current context
TAG=$(git describe --abbrev=0 --tags)

if [ -z $TAG ]; then
   echo "ERROR : tag not set.";
   exit 1;
fi


# install with --no-bin-links to avoid simlinks, this is needed to copy build content around
docker run -v $(pwd)/.clone/src:/tmp/build $BUILDCONTAINER sh -c 'cd /tmp/build/ && npm install --no-bin-links'

# zip the build up
tar -czvf ./build.tar.gz .clone/src 

docker build -t $CONTAINERNAME .
docker tag $CONTAINERNAME:latest $CONTAINERNAME:$TAG 

# smoke test 
if [ $SMOKETEST -eq 1 ]; then
    ./smoketest.sh
fi

if [ $DOCKERPUSH -eq 1 ]; then
    docker login -u $DOCKER_USER -p $DOCKER_PASS 
    docker push $CONTAINERNAME:$TAG 
    echo "Container pushed to docker hub";
fi

echo "Build done";
