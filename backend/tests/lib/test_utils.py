"""Tests for util methods."""
import math

from backend.lib.utils import iterators


def test_iterate_in_slices_odd_fit():
    """
    Test that _iterate_in_slices always stays below the given output size.

    Specifically tests the case when the batch size foes not fit evenlty into the
    total size. In addition, test that no extra iterations are required.
    """
    total_size = 10
    output_size = 3

    iterable = iter(range(total_size))

    output = []
    for idx, slice_ in enumerate(iterators.iterate_in_slices(iterable, output_size)):
        assert 0 < len(slice_) <= output_size
        assert idx < math.ceil(total_size / output_size)
        output.extend(slice_)

    assert len(output) == total_size


def test_iterate_in_slices_even_fit():
    """
    Test that iterate_in_slices handles the end of a list properly.

    Specifically tests the case when the batch size fits evenly into the total size.
    """
    total_size = 10
    batch_size = 2
    iterable = iter(range(total_size))

    output = []
    for idx, slice_ in enumerate(iterators.iterate_in_slices(iterable, batch_size)):
        assert 0 < len(slice_) <= batch_size
        assert idx < math.ceil(total_size / batch_size)
        output.extend(slice_)

    assert len(output) == total_size
