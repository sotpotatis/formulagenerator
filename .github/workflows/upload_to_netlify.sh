#upload_to_netlify.sh
#Quite self-explanatory script name. Also see the
#GitHub Action with the same name.
echo "Starting upload action, uploading to ${NETLIFY_SITE_ID}..."
echo "Installing dependencies..."
npm install
echo "✅ Dependencies installed!"
echo "Starting build..."
npx parcel build src/html/index.html
echo "✅ Build completed!"
echo "Uploading to Netlify..."
npx netlify link --name $NETLIFY_SITE_ID
npx netlify deploy --dir=dist --auth=$NETLIFY_AUTH_TOKEN --alias=$NETLIFY_SITE_ID
echo "✅ Uploaded to Netlify!"
echo "🚀 Website successfully deployed to Netlify."