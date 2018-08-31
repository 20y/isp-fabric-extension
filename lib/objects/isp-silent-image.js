'use strict';

const
    fabric          = require('./../../index.js').getFabric(),
    _fromObject     = fabric.Image.fromObject,
    ISPSilentImage  = fabric.util.createClass(fabric.Image, {});

ISPSilentImage.fromObject = function(obj, callback) {
	_fromObject.call(this, obj, (img, err) => {
		if (!err)
			return callback(img, err);

		obj.src = ISPSilentImage.errBase64;
		obj.err = err;

		_fromObject.call(this, obj, (img, _err) => {
			img.err = err;

			callback(img, _err)
		});
	});
};

ISPSilentImage.errBase64 = ''
	+ 'data:image/gif;base64,R0lGODlhNwAKAKIAAP8AAP+2tv+Ojv88PP/d3f/////p6f9lZSH/C1hNUCBEYXRhWE1QP'
	+ 'D94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZ'
	+ 'G9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2O'
	+ 'jI3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1uc'
	+ 'yMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iI'
	+ 'HhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlL'
	+ 'mNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb'
	+ '3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3NUE5NTc5Q0FDN0QxMUU4QTQzQ0VBN0U2RDc4QTQxOCIgeG1wTU06RG9jd'
	+ 'W1lbnRJRD0ieG1wLmRpZDo3NUE5NTc5REFDN0QxMUU4QTQzQ0VBN0U2RDc4QTQxOCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZ'
	+ 'jppbnN0YW5jZUlEPSJ4bXAuaWlkOjc1QTk1NzlBQUM3RDExRThBNDNDRUE3RTZENzhBNDE4IiBzdFJlZjpkb2N1bWVudElEPSJ4b'
	+ 'XAuZGlkOjc1QTk1NzlCQUM3RDExRThBNDNDRUE3RTZENzhBNDE4Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwve'
	+ 'Dp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU0'
	+ '9LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJi'
	+ 'IeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+P'
	+ 'Tw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEAAAAAAAsAAAAA'
	+ 'DcACgAAA7NIQlURTciipITOChguXc2jMM6jhcDQDOoxBMNhPMDxRMCjD9Ib5KtXKijIwQ4OwJBVNBQMAMEz2sA5p9JC8Ydh/ZY8g'
	+ 'BO6qb2YYqy6WrQQqNocsOA1w8LjKDeKzkvJVXE6gIJzdT8CfVhcX3hqhFYNhFuGQjQpTYs5BAcpMFKJEJBxVwUHBwScqKcOPFycm'
	+ 'GmhXBQsrV6ScJGSLjFOBCw8SRDAYcEYgcnKy8zNzs/Q0dLOCQA7';

module.exports = ISPSilentImage;
