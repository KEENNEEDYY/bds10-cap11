FROM openjdk:11
VOLUME /tmp
EXPOSE 8080
ADD ./target/bds10-0.0.1-SNAPSHOT.jar BDS10.jar
ENTRYPOINT ["java","-jar","/BDS10.jar"]
