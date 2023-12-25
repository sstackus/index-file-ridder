const Ansi = {
  RESET: '\x1b[0m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  LIGHTGRAY: '\x1b[90m',
  BOLD: '\x1b[1m',
};

const out = {
  success(message: string) {
    return console.log(`${Ansi.BOLD}${Ansi.GREEN}${message}${Ansi.RESET}`);
  },
  error(message: string) {
    return console.log(`${Ansi.BOLD}${Ansi.RED}${message}${Ansi.RESET}`);
  },
  log(message: string) {
    return console.log(`${Ansi.LIGHTGRAY}${message}${Ansi.RESET}`);
  },
};

export { out };
