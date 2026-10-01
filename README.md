# Pegasus Complete Frontend

This is the complete navigable frontend prototype for the Pegasus sewing-machine business workflow.

## Flow

Dashboard
→ Master Module
→ User Management / Customer Master / Machine Model / Parts / Grouping / Description
→ Proforma Invoice
→ Create/Edit/View PI
→ PI Conversion
→ Detailed machine + part conversion
→ Overall sale price
→ Profit/Loss in $ and %
→ Multiple commissions
→ Owner profit
→ Customer target-price calculator
→ Finalize
→ PI Report / Converted PI Report

## Important business rules implemented

1. Machine Master provides the predefined PI rate.
2. PI can override the predefined rate.
3. Last sold rate is shown as an in-app reference while creating/editing a PI and is not shown on the printable PI.
4. PI supports multiple SI numbers / machines.
5. Conversion expands the machine grouping into machine + individual parts.
6. Sale Price is a single overall value for the PI, not an individual part sale price.
7. Profit/Loss is shown in dollars and percentage.
8. Multiple commission people can be added.
9. Owner profit is calculated after commission.
10. Customer target price is a what-if calculation and does not change the actual sale price.
11. Changes to the original PI can be reflected in a later conversion because conversion is generated from the PI.
12. Changes made only in Conversion do not update the original PI.
13. Finalized conversion is read-only.
14. Reports are view-only.

## Run

npm install
npm run dev

This build uses local in-memory data. The next step is Supabase integration for authentication, permissions and persistent records.

Vercel deployment trigger: Git repository connection verified.
