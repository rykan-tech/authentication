# File to make docker image

RYKAN_BASE = rykan
RYKAN_MACROSERVICE = auth
RYKAN_MICROSERVICE = login
RYKAN_IMAGE_NAME = $(RYKAN_BASE)/$(RYKAN_MACROSERVICE)-$(RYKAN_MICROSERVICE)

# Copying is done temporaily so we don't have to include the entire repo as build context
image:
	cp -av ../defs/. ./defs/
	docker build -t $(RYKAN_IMAGE_NAME) .
	rm -rfv ./defs