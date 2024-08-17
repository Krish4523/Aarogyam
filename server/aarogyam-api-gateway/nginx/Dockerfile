# Use the official NGINX image
FROM nginx:alpine

# Copy the custom NGINX configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy any additional necessary files (e.g., certificates) if needed
# COPY path/to/your/file /destination/path

CMD ["nginx", "-g", "daemon off;"]
