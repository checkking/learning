ROOT := .
OUTPUT := output

all: pre protoc_amessage pack unpack

pre:
	rm -rf $(OUTPUT)
	mkdir $(OUTPUT)

protoc_amessage:
	 protoc-c --c_out=. amessage.proto

pack:
	gcc -g -o ./$(OUTPUT)/packer pack.c amessage.pb-c.c -I./ -lprotobuf-c -pthread

unpack:
	gcc -g -o ./$(OUTPUT)/unpacker unpack.c amessage.pb-c.c -I./ -lprotobuf-c -pthread

clean:
	rm -rf $(OUTPUT)
