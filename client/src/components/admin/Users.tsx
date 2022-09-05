import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import * as React from "react";

// Generate Order Data
function createData(
  id: number,
  name: string,
  email: string,
  paymentMethod: string,
  amount: number
) {
  return { id, name, email, paymentMethod, amount };
}

const rows = [
  createData(0, "Elvis Presley", "elvispresly@email.com", "usertype", 312.44),
  createData(
    1,
    "Paul McCartney",
    "paulmaccartney@email.com",
    "usertype",
    866.99
  ),
  createData(2, "Tom Scholz", "tomscholz@email.com", "usertype", 100.81),
  createData(
    3,
    "Michael Jackson",
    "michaeljackson@email.com",
    "usertype",
    654.39
  ),
  createData(
    4,
    "Bruce Springsteen",
    "brucesprinsteen@email.com",
    "usertype",
    212.79
  ),
];

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export default function Users() {
  return (
    <React.Fragment>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Usertype</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.paymentMethod}</TableCell>
              <TableCell align="right">
                <IconButton>
                  <EditIcon color="inherit" sx={{ display: "block" }} />
                </IconButton>
                <IconButton>
                  <DeleteForeverIcon
                    color="inherit"
                    sx={{ display: "block" }}
                  />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more orders
      </Link>
    </React.Fragment>
  );
}
