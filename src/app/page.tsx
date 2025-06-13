// app/page.tsx
"use client";

import { Typography, Container } from "@mui/material";

export default function HomePage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to CBBC Analytics
      </Typography>
      <Typography variant="body1">
        Start exploring data for Callable Bull/Bear Contracts (CBBCs).
      </Typography>
    </Container>
  );
}
