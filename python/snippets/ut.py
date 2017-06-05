#!/usr/bin/env python
# -*- coding: utf-8 -*-
import unittest

import math

class MathTestCase(unittest.TestCase):
    def test_sqrt(self):
        self.assertEqual(math.sqrt(4) * math.sqrt(4), 4)

if __name__ == "__main__":
    unittest.main()
