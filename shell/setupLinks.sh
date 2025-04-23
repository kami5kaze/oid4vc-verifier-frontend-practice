#!/bin/bash

echo "Setting up npm links..."

WORKING_DIR=$(pwd)
BUILD_DIR=./build
OID4VC_CORE_DIR=/oid4vc-core
OID4VC_PREX_DIR=/oid4vc-prex
MDOC_CBOR_TS_DIR=/mdoc-cbor-ts

cd $BUILD_DIR$OID4VC_CORE_DIR
npm i
npm run build
npm link

cd $WORKING_DIR
cd $BUILD_DIR$OID4VC_PREX_DIR
npm i
npm link oid4vc-core
npm run build
npm link

cd $WORKING_DIR
cd $BUILD_DIR$MDOC_CBOR_TS_DIR
npm i
npm link oid4vc-core
npm run build
npm link

cd $WORKING_DIR
npm i
npm link oid4vc-core oid4vc-prex mdoc-cbor-ts

echo "Done"