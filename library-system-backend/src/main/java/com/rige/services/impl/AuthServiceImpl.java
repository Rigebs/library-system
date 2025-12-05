package com.rige.services.impl;

import com.rige.dto.request.AuthRequest;
import com.rige.dto.request.UserRequest;
import com.rige.dto.response.TokenResponse;
import com.rige.dto.response.UserResponse;
import com.rige.entities.UserEntity;
import com.rige.enums.Role;
import com.rige.mappers.UserMapper;
import com.rige.repositories.UserRepository;
import com.rige.security.JwtUtils;
import com.rige.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Override
    @Transactional
    public UserResponse register(UserRequest request) {

        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("Email already in use.");
        }

        UserEntity user = userMapper.toEntity(request);

        user.setRole(Role.USER);

        user.setPassword(passwordEncoder.encode(request.password()));

        user.setRegistrationDate(LocalDateTime.now());

        UserEntity savedUser = userRepository.save(user);
        return userMapper.toResponse(savedUser);
    }

    @Override
    public TokenResponse login(AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.email(),
                            request.password()
                    )
            );
        } catch (AuthenticationException e) {
            throw new RuntimeException("Invalid credentials for user: " + request.email());
        }

        UserEntity user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Authentication succeeded but user not found."));

        String accessToken = jwtUtils.createAccessToken(user);
        String refreshToken = jwtUtils.createRefreshToken(user.getEmail());

        return new TokenResponse(accessToken, refreshToken);
    }

    @Override
    public TokenResponse refreshToken(String refreshToken) {
        try {
            String email = jwtUtils.getEmailFromToken(refreshToken);

            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            String newAccessToken = jwtUtils.createAccessToken((UserEntity) userDetails);

            return new TokenResponse(newAccessToken, refreshToken);

        } catch (UsernameNotFoundException e) {
            throw new RuntimeException("User not found for refresh token.", e);
        } catch (Exception e) {
            throw new RuntimeException("Invalid or expired refresh token.", e);
        }
    }
}