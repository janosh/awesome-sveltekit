#!/usr/bin/env python
import re


def main() -> int:
    for filename in ("sites.yml", "readme.md"):
        with open(filename) as file:
            text = file.read()

        text = text.replace("www.", "")

        # remove trailing slash from URLs
        if filename == "readme.md":
            text = re.sub(r"/\)", ")", text)
        if filename == "sites.yml":
            text = re.sub(r"(.+https?://.+)/$", r"\g<1>", text, flags=re.MULTILINE)

        with open(filename, "w") as file:
            file.write(text)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
