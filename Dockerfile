FROM python:3.11-slim

WORKDIR /app

COPY pyproject.toml README_PYPI.md ./
COPY src ./src

RUN pip install --no-cache-dir .

LABEL org.opencontainers.image.source="https://github.com/pepkio/pepkio-kg-single-cell-long-read-rna-sequencing"

ENTRYPOINT ["pepkio-kg-single-cell-long-read-rna-sequencing"]
