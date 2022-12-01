#!/usr/bin/env python
import re


def main() -> int:
    for filename in ("sites.yml", "readme.md"):
        with open(filename) as file:
            text = file.read()

        text = text.replace("www.", "")

        # remove trailing slash from URLs
        if filename == "readme.md":
            # target markdown inline links [link](url/)
            text = re.sub(r"/\)", ")", text)

        # target URLs with a slash followed by white space, question mark (start of
        # query string) or end of line
        text = re.sub(
            "(.*https?://.+)/(\\s|\\?|$)", r"\g<1>\g<2>", text, flags=re.MULTILINE
        )

        with open(filename, "w") as file:
            file.write(text)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
