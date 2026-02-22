FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY src ./src
ENV PYTHONPATH=/app/src
EXPOSE 8081
CMD ["gunicorn", "--bind", "0.0.0.0:8081", "foxmemory_infer.main:app"]
