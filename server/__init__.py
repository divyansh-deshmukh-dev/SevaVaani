# SevaVaani Server Package
import importlib
import importlib.abc
import importlib.machinery
import importlib.util
import sys
from pathlib import Path

# Ensure the server directory is on sys.path so modules can import directly
# as well as via "server."
_SERVER_DIR = Path(__file__).resolve().parent
if str(_SERVER_DIR) not in sys.path:
    sys.path.insert(0, str(_SERVER_DIR))

# Unify "server.<module>" and "<module>" so both resolve to the exact same module object
class _ServerAliasLoader(importlib.abc.Loader):
    def __init__(self, target_name: str):
        self.target_name = target_name

    def create_module(self, spec):
        mod = importlib.import_module(self.target_name)
        sys.modules[spec.name] = mod
        return mod

    def exec_module(self, module):
        pass

class _ServerAliasFinder(importlib.abc.MetaPathFinder):
    def find_spec(self, fullname, path, target=None):
        if fullname.startswith("server."):
            sub = fullname[7:]
            try:
                if importlib.util.find_spec(sub) is not None:
                    return importlib.machinery.ModuleSpec(fullname, _ServerAliasLoader(sub))
            except Exception:
                pass
        return None

if not any(isinstance(finder, _ServerAliasFinder) for finder in sys.meta_path):
    sys.meta_path.insert(0, _ServerAliasFinder())
