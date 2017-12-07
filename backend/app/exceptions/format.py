"""Handle request handling errors."""


class InvalidFormat(Exception):
    """Exception class for invalid file or data format."""

    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        """Initialize an exception."""
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload
