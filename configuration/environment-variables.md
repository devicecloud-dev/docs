# Environment Variables

Device Cloud allows you to inject environment variables into your test flows, enabling dynamic configuration and secure credential management.

## Setting Environment Variables

### Command Line
```bash
dcd cloud -e API_URL=https://api.example.com -e API_KEY=secret
```

### Multiple Variables
```bash
dcd cloud -e DB_HOST=localhost \
          -e DB_USER=test \
          -e DB_PASS=password \
          -e ENVIRONMENT=staging
```

## Use Cases

### Configuration Management
```bash
# Development
dcd cloud -e API_URL=https://dev-api.example.com

# Staging
dcd cloud -e API_URL=https://staging-api.example.com

# Production
dcd cloud -e API_URL=https://api.example.com
```

### Secure Credentials
```bash
dcd cloud -e USERNAME=${CI_USERNAME} \
          -e PASSWORD=${CI_PASSWORD}
```

## Best Practices

- Never commit sensitive values
- Use CI/CD secrets
- Use UPPERCASE for variable names
- Use descriptive names

