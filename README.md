# sseTest
Simple Server Side Event tester for IBM containers and cf apps


To run as a cf app:

    cf push <appname> -m 64M -p <directory>

To run as a container group:

    cf ic build -t ssetestimg <directory>
    cf ic group create --name <containerName> -m 64 -n <hostname> -d mybluemix.net -p 3000 --min 1 --max 1 --desired 1 <namespace>/ssetestimg:latest
