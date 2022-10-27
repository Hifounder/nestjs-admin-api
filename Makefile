DIRNAME:= $(notdir $(CURDIR))

.PHONY: build

install:
	npm ci

build:
	docker build -t $(DIRNAME):local .

run:
	docker run -it --rm -p 3000:3000 $(DIRNAME):local

rmi:
	docker rmi $(DIRNAME):local

clean:
	rm -rf node_modules
	rm -rf dist
