import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    FormControl,
    FormHelperText,
    Grid,
    Box,
    Typography,
    Container,
} from "@mui/material/";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import styled from "styled-components";

// mui의 css 우선순위가 높기때문에 important를 설정 - 실무하다 보면 종종 발생 우선순위 문제
const FormHelperTexts = styled(FormHelperText)`
    width: 100%;
    padding-left: 16px;
    font-weight: 700 !important;
    color: #d32f2f !important;
`;

const Boxs = styled(Box)`
    padding-bottom: 40px !important;
`;

const SignUpPage = () => {
    const theme = createTheme();
    const [admin, setAdmin] = useState(false);
    const [adminEnabled, setAdminEnabled] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordState, setPasswordState] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [nameError, setNameError] = useState("");
    const [registerError, setRegisterError] = useState("");

    const navigate = useNavigate();

    const onhandlePost = async (data) => {
        const { email, name, password, factoryName } = data;
        const postData = { email, name, password, factoryName };
        console.log(postData);
        // post
        if (admin === false) {
            await axios
                .post("/api/auth/signup", postData)
                .then(function (response) {
                    console.log(response, "일반 계정 생성");
                    navigate("/login");
                })
                .catch(function (err) {
                    console.log(err);
                    setRegisterError(
                        "회원가입에 실패하였습니다. 다시한번 확인해 주세요."
                    );
                });
        } else {
            await axios
                .post("/api/admin/signup", postData)
                .then(function (response) {
                    console.log(response, "관리자 계정 생성");
                    navigate("/login");
                })
                .catch(function (err) {
                    console.log(err);
                    setRegisterError(
                        "회원가입에 실패하였습니다. 다시한번 확인해 주세요."
                    );
                });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = new FormData(e.currentTarget);
        const joinData = {
            email: data.get("email"),
            name: data.get("name"),
            password: data.get("password"),
            rePassword: data.get("rePassword"),
            factoryName: data.get("factory"),
        };
        const { email, name, password, rePassword } = joinData;

        // 이메일 유효성 체크
        const emailRegex =
            /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if (!emailRegex.test(email))
            setEmailError("올바른 이메일 형식이 아닙니다.");
        else setEmailError("");

        // 비밀번호 유효성 체크
        const passwordRegex = /^.{4,25}$/;
        if (!passwordRegex.test(password))
            setPasswordState("4자리 이상 입력해주세요!");
        else setPasswordState("");

        // 비밀번호 같은지 체크
        if (password !== rePassword)
            setPasswordError("비밀번호가 일치하지 않습니다.");
        else setPasswordError("");

        // 이름 유효성 검사
        const nameRegex = /^[가-힣a-zA-Z]+$/;
        if (!nameRegex.test(name) || name.length < 1)
            setNameError("올바른 이름을 입력해주세요.");
        else setNameError("");

        if (
            emailRegex.test(email) &&
            passwordRegex.test(password) &&
            password === rePassword &&
            nameRegex.test(name)
        ) {
            onhandlePost(joinData);
        }
    };

    function handleKeyDown(event) {
        if (event.ctrlKey && event.altKey && event.key === "Enter") {
            setAdminEnabled(true);
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main" }} />
                    <Typography component="h1" variant="h5">
                        회원가입
                    </Typography>
                    <Boxs
                        component="form"
                        noValidate
                        onSubmit={handleSubmit}
                        sx={{ mt: 3 }}
                    >
                        <FormControl component="fieldset" variant="standard">
                            <Grid container spacing={2}>
                                <Grid item xs={12} style={{ display: "flex" }}>
                                    <TextField
                                        required
                                        autoFocus
                                        fullWidth
                                        type="email"
                                        id="email"
                                        name="email"
                                        label="이메일 주소"
                                        error={emailError !== "" || false}
                                    ></TextField>
                                    <br />
                                </Grid>

                                <FormHelperTexts>{emailError}</FormHelperTexts>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        type="password"
                                        id="password"
                                        name="password"
                                        label="비밀번호 (4자리 이상)"
                                        error={passwordState !== "" || false}
                                    />
                                </Grid>
                                <FormHelperTexts>
                                    {passwordState}
                                </FormHelperTexts>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        type="password"
                                        id="rePassword"
                                        name="rePassword"
                                        label="비밀번호 재입력"
                                        error={passwordError !== "" || false}
                                    />
                                </Grid>
                                <FormHelperTexts>
                                    {passwordError}
                                </FormHelperTexts>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="name"
                                        name="name"
                                        label="이름"
                                        error={nameError !== "" || false}
                                    />
                                </Grid>
                                <FormHelperTexts>{nameError}</FormHelperTexts>

                                <Grid
                                    item
                                    xs={12}
                                    style={{ textAlign: "left" }}
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                value="allowExtraEmails"
                                                color="primary"
                                                disabled={!adminEnabled}
                                                onChange={() => {
                                                    setAdmin(!admin);
                                                }}
                                            />
                                        }
                                        label="ADMIN"
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                size="large"
                            >
                                계정 생성
                            </Button>
                        </FormControl>
                        <FormHelperTexts>{registerError}</FormHelperTexts>
                    </Boxs>
                </Box>
            </Container>
        </ThemeProvider>
    );
};
export default SignUpPage;
