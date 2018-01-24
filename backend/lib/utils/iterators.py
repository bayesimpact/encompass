"""Iterators utils."""


def iterate_in_slices(iterable, batch_size):
    """Yield lists of size batch_size from an iterable."""
    it = iter(iterable)
    try:
        while True:
            chunk = []  # The buffer to hold the next n items.
            for _ in range(batch_size):
                chunk.append(next(it))
            yield chunk
    except StopIteration:
        if len(chunk) > 0:
            yield chunk
