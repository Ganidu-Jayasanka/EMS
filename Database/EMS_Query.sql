-- Database

CREATE DATABASE EMS;

USE EMS;

-- Department Tb

CREATE Table dbo.Departments (
DepartmentId INT Identity(1,1) Primary Key,
DepartmentCode NVARCHAR(20) NOT NULL,
DepartmentName NVARCHAR(100) NOT NULL,
CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
UpdatedAt DATETIME2  NULL
);

CREATE UNIQUE INDEX UX_Departments_Code ON dbo.Departments(DepartmentCode);
CREATE UNIQUE INDEX UX_DepartmentName ON dbo.Departments(DepartmentName);


Select * from dbo.Departments;

-- Employee Tb

CREATE TABLE dbo.Employees (
EmployeeId INT Identity(1,1) Primary Key,
FirstName NVARCHAR(100) NOT NULL,
LastName NVARCHAR(100) NOT NULL,
Email NVARCHAR(255) NOT NULL,
DOB DATE NOT NULL,
Salary DECIMAL(18,2) NOT NULL,
DepartmentId INT NOT NULL   
CONSTRAINT FK_Employees_Departments FOREIGN KEY (DepartmentId) REFERENCEs Departments(DepartmentId)
);

Create UNIQUE INDEX UX_Email ON dbo.Employees(Email);

Select * from Employees;

-- Sample Insert Data

Insert into dbo.Departments (DepartmentCode, DepartmentName, UpdatedAt) Values ('IT01', 'IT', NULL);

Insert into dbo.Employees (FirstName, LastName, Email, DOB, Salary, DepartmentId) Values 
         ('Ganidu', 'Jayasanka', 'ganidujayasanka@gmail.com', '1999-07-28', '150000.00','1');

-- View for Age Calculation & Employee Age check

CREATE VIEW dbo.vmEmployeesAGE AS 
SELECT 
    FirstName + ' ' + LastName AS FullName,
    Salary,
    DOB,
    DATEDIFF(YEAR, DOB, GETDATE()) 
      - CASE 
          WHEN (MONTH(DOB) > MONTH(GETDATE()))
             OR (MONTH(DOB) = MONTH(GETDATE()) AND DAY(DOB) > DAY(GETDATE()))
          THEN 1 
          ELSE 0 
        END AS Age
FROM dbo.Employees;

-- View Check

SELECT  * FROM vmEmployeesAGE; 


