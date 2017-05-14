ROOT := .
OUTPUT := output

all: pre protoc_addressbook writer reader

pre:
	rm -rf $(OUTPUT)
	mkdir $(OUTPUT)

protoc_addressbook:
	/usr/local/bin/protoc --cpp_out=./cout -I=./proto/ ./proto/addressbook.proto

writer:
	g++ -g -o ./$(OUTPUT)/writer AddPerson.cpp ./cout/addressbook.pb.cc -I./cout -L/usr/local/lib  -lprotobuf -pthread

reader:
	g++ -g -o ./$(OUTPUT)/reader ListPerson.cpp ./cout/addressbook.pb.cc -I./cout -L/usr/local/lib  -lprotobuf -pthread

clean:
	rm -rf $(OUTPUT) ./cout/*
