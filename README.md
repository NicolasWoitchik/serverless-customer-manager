# Serverless - Customer Manager

This project has been developed to solve the Customer Management. 

### Usage

1) Clone the project
```bash
git clone https://github.com/NicolasWoitchik/serverless-customer-manager
```

2) Install the dependencies
```bash
yarn
```

3) Install serverless cli
```bash
npm install -g serverless
```

4) Install serverless offline dependencies
```bash
serverless dynamodb install
serverless dynamodb start
```

5) Into another bash, run the application
```bash
serverless offline
```

### Features

- [x] Create new customer with `first_name` `last_name` and `email`
- [x] Update existing customer with both fields
- [x] Get customer by `email`
- [x] Delete customer by `email`
- [ ] Filter customers with `free text search`