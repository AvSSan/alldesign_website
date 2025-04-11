import sys
import os

class StreamToFile(object):
    def __init__(self, filename):
        self.terminal = sys.stdout
        self.log = open(filename, "a")

    def write(self, message):
        self.terminal.write(message)
        self.log.write(message)
        self.log.flush()

    def flush(self):
        self.terminal.flush()
        self.log.flush()

# Путь к файлу лога
log_file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'django_console.log')

# Перенаправление stdout и stderr
sys.stdout = StreamToFile(log_file_path)
sys.stderr = StreamToFile(log_file_path)