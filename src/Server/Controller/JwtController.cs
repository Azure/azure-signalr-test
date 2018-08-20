﻿using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace Microsoft.Azure.SignalR.Test.Server
{
    [Route("jwt")]
    public class JwtController : Controller
    {
        private static readonly SecurityKey SigningKey = new SymmetricSecurityKey(Guid.NewGuid().ToByteArray());

        private static readonly JwtSecurityTokenHandler JwtTokenHandler = new JwtSecurityTokenHandler();

        public static readonly SigningCredentials SigningCreds = new SigningCredentials(SigningKey, SecurityAlgorithms.HmacSha256);

        public const string Issuer = "ChatJwt";

        public const string Audience = "ChatJwt";

        [HttpGet("login")]
        public IActionResult Login([FromQuery] string username, [FromQuery] string role)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(role))
            {
                return BadRequest("Username and role is required.");
            }

            if (!IsExistingUser(username))
            {
                return Unauthorized();
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, username),
                new Claim(ClaimTypes.Role, role)
            };

            var claimsIdentity = new ClaimsIdentity(claims);

            var token = JwtTokenHandler.CreateJwtSecurityToken(
                issuer: Issuer,
                audience: Audience,
                subject: claimsIdentity,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: SigningCreds
            );

            return Ok(JwtTokenHandler.WriteToken(token));
        }

        private bool IsExistingUser(string username)
        {
            return username.StartsWith("jwt");
        }
    }
}
