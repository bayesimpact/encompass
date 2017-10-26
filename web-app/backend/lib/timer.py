"""Timer functions."""
import inspect
from functools import wraps
from time import time


def timed(f):
    @wraps(f)
    def wrapper(*args, **kwds):
        args_name = inspect.getargspec(f)[0]
        args_dict = dict(zip(args_name, args))
        logger = None
        if 'app' in args_dict.keys():
            logger = args_dict['app'].logger
        elif 'logger' in args_dict.keys():
            logger = args_dict['logger']

        start = time()
        result = f(*args, **kwds)
        elapsed = time() - start

        timer_message = '%s took %d seconds to complete.' % (f.__name__, elapsed)
        if logger:
            logger.warn(timer_message)
        else:
            print(timer_message)
        return result
    return wrapper
