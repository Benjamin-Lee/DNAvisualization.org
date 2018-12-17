# MIT License
#
# Copyright (c) 2018 IQT Labs LLC
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

import numpy as np
from itertools import islice

def _k_mers(sequence, k):
    it = iter(sequence)
    result = tuple(islice(it, k))
    if len(result) == k:
        yield "".join(result)
    for elem in it:
        result = result[1:] + (elem,)
        yield "".join(result)

def transform(sequence, method="squiggle"):
    '''Transforms a DNA sequence into a series of coordinates for 2D visualization.

    Args:
        sequence (str): The DNA sequence to transform.
        method (str): The method by which to transform the sequence. Defaults to "squiggle". Valid options are ``squiggle``, ``gates``, ``yau``, ``randic`` and ``qi``.
        bar (bool): Whether to display a progress bar. Defaults to false.

    Returns:
        tuple: A tuple containing two lists: one for the x coordinates and one for the y coordinates.

    Example:
        >>> transform("ATGC")
        ([0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0], [0, 0.5, 0, -0.5, -1, -0.5, 0, -0.5, 0])
        >>> transform("ATGC", method="gates")
        ([0, 0, 0, 1, 0], [0, -1, 0, 0, 0])
        >>> transform("ATGC", method="yau")
        ([0, 0.5, 1.0, 1.8660254037844386, 2.732050807568877], [0, -0.8660254037844386, 0.0, -0.5, 0.0])
        >>> transform("ATGC", method="yau-bp")
        ([0, 1, 2, 3, 4], [0, -1, 0, -0.5, 0.0])
        >>> transform("ATGC", method="randic")
        ([0, 1, 2, 3], [3, 2, 1, 0])
        >>> transform("ATGC", method="qi")
        ([0, 1, 2], [8, 7, 11])

    Warning:
        The entire sequence must be able to fit in memory.

    Raises:
        ValueError: When an invalid character is in the sequence.
    '''

    sequence = sequence.upper()

    if method == "squiggle":
        running_value = 0
        x, y = np.linspace(0, len(sequence), 2 * len(sequence) + 1), [0]
        for character in sequence:
            if character == "A":
                y.extend([running_value + 0.5, running_value])
            elif character == "C":
                y.extend([running_value - 0.5, running_value])
            elif character == "T":
                y.extend([running_value - 0.5, running_value - 1])
                running_value -= 1
            elif character == "G":
                y.extend([running_value + 0.5, running_value + 1])
                running_value += 1
            else:
                y.extend([running_value] * 2)
        return list(x), y

    elif method == "gates":
        x, y = [0], [0]
        for character in sequence:
            if character == "A":
                x.append(x[-1]) # no change in x coord
                y.append(y[-1] - 1)
            elif character == "T":
                x.append(x[-1]) # no change in x coord
                y.append(y[-1] + 1)
            elif character == "G":
                x.append(x[-1] + 1)
                y.append(y[-1]) # no change in y coord
            elif character == "C":
                x.append(x[-1] - 1)
                y.append(y[-1]) # no change in y coord
            else:
                raise ValueError("Invalid character in sequence: " + character + ". Gates's method does not support non-ATGC bases. Try using method=squiggle.")

    elif method == "yau":
        x, y = [0], [0]
        for character in sequence:
            if character == "A":
                x.append(x[-1] + 0.5)
                y.append(y[-1] - ((3**0.5) / 2))
            elif character == "T":
                x.append(x[-1] + 0.5)
                y.append(y[-1] + ((3**0.5) / 2))
            elif character == "G":
                x.append(x[-1] + ((3**0.5) / 2))
                y.append(y[-1] - 0.5)
            elif character == "C":
                x.append(x[-1] + ((3**0.5) / 2))
                y.append(y[-1] + 0.5)
            else:
                raise ValueError("Invalid character in sequence: " + character + ". Yau's method does not support non-ATGC bases. Try using method=squiggle.")

    elif method == "yau-bp":
        x, y = [0], [0]
        for character in sequence:
            if character == "A":
                x.append(x[-1] + 1)
                y.append(y[-1] - 1)
            elif character == "T":
                x.append(x[-1] + 1)
                y.append(y[-1] + 1)
            elif character == "G":
                x.append(x[-1] + 1)
                y.append(y[-1] - 0.5)
            elif character == "C":
                x.append(x[-1] + 1)
                y.append(y[-1] + 0.5)
            else:
                raise ValueError("Invalid character in sequence: " + character + ". Yau's method does not support non-ATGC bases. Try using method=squiggle.")

    elif method == "randic":
        x, y = [], []
        mapping = dict(A=3, T=2, G=1, C=0)
        for i, character in enumerate(sequence):
            x.append(i)
            try:
                y.append(mapping[character])
            except KeyError:
                raise ValueError("Invalid character in sequence: " + character + ". Randić's method does not support non-ATGC bases. Try using method=squiggle.")

    elif method == "qi":
        mapping = {'AA': 12,
                   'AC': 4,
                   'GT': 6,
                   'AG': 0,
                   'CC': 13,
                   'CA': 5,
                   'CG': 10,
                   'TT': 15,
                   'GG': 14,
                   'GC': 11,
                   'AT': 8,
                   'GA': 1,
                   'TG': 7,
                   'TA': 9,
                   'TC': 3,
                   'CT': 2}
        x, y = [], []

        for i, k_mer in enumerate(_k_mers(sequence, 2)):
            x.append(i)
            try:
                y.append(mapping[k_mer])
            except KeyError:
                raise ValueError("Invalid k-mer in sequence: " + k_mer + ". Qi's method does not support non-ATGC bases. Try using method=squiggle.")

    else:
        raise ValueError("Invalid method. Valid methods are 'squiggle', 'gates', 'yau', and 'randic'.")

    return x, y
