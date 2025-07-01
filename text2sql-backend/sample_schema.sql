CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    city VARCHAR(50)
);
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    category VARCHAR(50),
    price DECIMAL(10, 2)
);
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(id),
    product_id INT REFERENCES products(id),
    quantity INT,
    order_date DATE
);
-- Insert customers
INSERT INTO customers (name, email, city) VALUES
('Alice Smith', 'alice@example.com', 'New York'),
('Bob Johnson', 'bob@example.com', 'Los Angeles'),
('Charlie Lee', 'charlie@example.com', 'Chicago');

-- Insert products
INSERT INTO products (name, category, price) VALUES
('iPhone 14', 'Electronics', 999.99),
('Samsung Galaxy S23', 'Electronics', 899.99),
('Nike Air Max', 'Footwear', 149.99),
('Adidas Ultraboost', 'Footwear', 179.99);

-- Insert orders
INSERT INTO orders (customer_id, product_id, quantity, order_date) VALUES
(1, 1, 1, '2024-06-01'),
(2, 3, 2, '2024-06-05'),
(1, 2, 1, '2024-06-10'),
(3, 4, 1, '2024-06-11');
