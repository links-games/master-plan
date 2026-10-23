"""Bounded regression tests for interrupted native-art encoding.

Run with /usr/bin/python3 experiments/test-save-concept-art.py.
"""

import importlib.util
import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from PIL import Image

spec = importlib.util.spec_from_file_location(
    'save_concept_art', Path(__file__).with_name('save-concept-art.py'))
encoder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(encoder)


class NativeEncodingTests(unittest.TestCase):
    def test_interrupted_encoder_never_publishes_partial_art(self):
        with tempfile.TemporaryDirectory() as temporary:
            base = Path(temporary)
            (base / 'jobs').mkdir()
            (base / 'jobs/sh.json').write_text(json.dumps([
                {'id': 'sh-99/01-gameplay', 'gameId': 'SH-99',
                 'direction': 'Gameplay', 'prompt': 'A bounded test image'}]))
            source = base / 'source.png'
            Image.new('RGB', (1254, 1254), '#123456').save(source)

            def interrupted_save(image, destination, *args, **kwargs):
                Path(destination).write_bytes(b'interrupted native encoding')
                raise OSError('Simulated encoder interruption')

            with patch.object(encoder, 'BASE', base), patch.object(
                    sys, 'argv', ['save-concept-art.py',
                                  'sh-99/01-gameplay', str(source)]), patch.object(
                    Image.Image, 'save', interrupted_save):
                with self.assertRaisesRegex(OSError, 'Simulated'):
                    encoder.main()
            self.assertFalse((base / 'art/sh-99/01-gameplay.webp').exists())
            self.assertFalse((base / 'art/sh-99/manifest.json').exists())
            self.assertEqual(list((base / 'art/sh-99').iterdir()), [])


if __name__ == '__main__':
    unittest.main()
