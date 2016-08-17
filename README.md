# Web Archiver

![preview](https://raw.githubusercontent.com/nismodao/webcrawler/master/out.gif)


## Tech Stack
1. React
2. Express
3. Node
4. RabbitMQ via CloudAMPQ
5. MongoDb via Mlab
 
## Instructions
1.  Clone this repo
2.  In the root directory create an .env file and add URIs for RabbitMQ (e.g., CLOUDAMQP_URL) and MongoDb (e.g, MONGODB_URI)
3.  Run npm install
4.  Run npm start
5.  Go to localhost:3000
6.  Enter URL -- a job ID will be returned 
7.  The URL is sent to a job queue and a worker downloads the html
8.  To check whether the download is complete enter in the job ID or resubmit the URL -- if download is complete an achrived version of the site is displayed