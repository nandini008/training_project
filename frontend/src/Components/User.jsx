import React, { useState, useEffect, Fragment } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";
import queryString from "query-string";
import Swal from "sweetalert2";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import SearchIcon from "@material-ui/icons/Search";
import Select from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import TableCell from '@material-ui/core/TableCell';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import Chip from '@material-ui/core/Chip';
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import moment from "moment";

function User(props) {
    const [users, setUsers] = useState(null);
    const [query, setQuery] = useState({
		limit: 100,
	});
	const [refresh, setRefresh] = useState(false);

    const handleDelete = (id) => {
        Swal.fire({
			title: "Are you sure?",
			text: "This user will be deleted!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Delete",
		}).then((result) => {
			if (result.isConfirmed) {
				axios
					.delete(`${process.env.REACT_APP_BACKEND_API_URL}user/${id}`)
					.then((res) => {
                        console.log(res);
						if (res.data.status === "success") {
							Swal.fire("Deleted!", "User deleted successfully...", "success");
							setRefresh(!refresh);
						}
					})
					.catch((err) => {
						Swal.fire("Deleted!", "Something went wrong...", "error");
					});
			}
		});
    };
    const handleQueryChange = (e) => {
		setUsers(null);
		setQuery({ ...query, [e.target.name]: e.target.value });
	};

    useEffect(() => {
		axios(
			`${process.env.REACT_APP_BACKEND_API_URL}user?${queryString.stringify(query)}`,
		).then((result) => setUsers(result.data.data.users));
	}, [refresh, query]);

    return (
        <Fragment>
            <div className="dashboard-container text-start">
                <div className="user-heading">
                    <h4>Users List</h4>
                    <Link to={`${props.match.path}/create`} style={{ textDecoration: 'none' }}>
                        <Button variant="contained" className="user-newdata">+ New Data</Button>
                    </Link>
                </div>
                <Grid container justifyContent="flex-end" className="my-3">
                    <form  onChange={handleQueryChange} className="user-form">
                        <section>
                            <p className="setting-content">Search</p>
                            <TextField placeholder="Keyword" name="keyword" className="setting-input user-input me-4" InputProps={{ disableUnderline: true, endAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }} variant="filled" />
                        </section>
                        <section>
                            <p className="setting-content">Role</p>
                            <FormControl variant="filled" className="setting-input me-4 user-input">
                                <Select native label="Role" placeholder="Role" disableUnderline inputProps={{ name: "role" }}>
                                    <option value="all">All Roles</option>
                                    <option value="admin">Admin</option>
                                    <option value="cashier">Cashier</option>
                                </Select>
                            </FormControl>
                        </section>
                        <section>
                            <p className="setting-content">Sort By</p>
                            <FormControl variant="filled" className="setting-input user-input">
                                <Select native placeholder="Role" disableUnderline inputProps={{ name: "sort" }}>
                                    <option value="Newest">Newest</option>
                                    <option value="Oldest">Oldest</option>
                                    <option value="Name">Name</option>
                                    <option value="Last Active">Last Active</option>
                                </Select>
                            </FormControl>
                        </section>
                    </form>
                </Grid>
                <Grid container className="mt-4">
                    <Grid item xs={12}>
                        <Paper>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Full Name</TableCell>
                                        <TableCell align="right">Username</TableCell>
                                        <TableCell align="right">Role</TableCell>
                                        <TableCell align="right">Last Active</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    { users && users.map((user) => (
                                        <TableRow key={user._id}>
                                            <TableCell component="th" scope="user">
                                                {user.fullname}
                                            </TableCell>
                                            <TableCell align="right">{user.username}</TableCell>
                                            <TableCell align="right">
                                                <Chip variant="outlined" label={user.role} color="secondary" />
                                            </TableCell>
                                            <TableCell align="right">
                                                {moment(user.lastActive).format("llll")}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Link to={`${props.match.path}/update/${user._id}`}>
                                                    <EditIcon />
                                                </Link>
                                                <DeleteIcon onClick={() => handleDelete(user._id)} className="delete-icon" />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </Fragment>
    )
}

export default User
