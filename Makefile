test-coveralls-1:
	nyc npm test && nyc report --reporter=text-lcov | coveralls

test-coveralls-2:
	echo Test coveralls 2