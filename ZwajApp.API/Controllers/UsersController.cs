using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZwajApp.API.Data;
using ZwajApp.API.Dtos;
using ZwajApp.API.Helper;
using ZwajApp.API.Models;

namespace ZwajApp.API.Controllers
{
    [ServiceFilter(typeof(LogUseActivity))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IZwajRepository _repo;
        private readonly IMapper _mapper;
        public UsersController(IZwajRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] PagenationParams pagenationParams)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var userFromRepo = await _repo.GetUser(userId);
            pagenationParams.UserId = userId;
            if (string.IsNullOrEmpty(pagenationParams.Gender))
            {
                pagenationParams.Gender = userFromRepo.Gender == "رجل" ? "إمرأة" : "رجل";
            }
            var users = await _repo.GetUsers(pagenationParams);
            Response.AddApplicationPagenation(users.CurrentPage, users.PageSize, users.TotalCount, users.TotlePages);
            var UsersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);
            return Ok(UsersToReturn);

        }
        [HttpGet("{id}", Name = "GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);
            var userToReturn = _mapper.Map<UserForDetailsDto>(user);
            return Ok(userToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UserForUpdateDto userForUpdateDto)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var userFromRepo = await _repo.GetUser(id);
            _mapper.Map(userForUpdateDto, userFromRepo);
            if (await _repo.SaveAll())
            {
                return NoContent();
            }
            throw new Exception($"حدثت مشكلة فى تعديل بيانات المشترك رق {id}");

        }

        [HttpPost("{id}/like/{recipientId}")]
        public async Task<IActionResult> LikeUser(int id, int recipientId)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var like = await _repo.GetLike(id, recipientId);
            if (like != null) return BadRequest("this user likee By this user Before");
            var userFromRepo = await _repo.GetUser(recipientId);
            if (userFromRepo == null) return NotFound("this user recipient is not found in data base");

            like = new Like
            {
                LikerId = id,
                LikeeId = recipientId
            };
            _repo.Add<Like>(like);
            if (await _repo.SaveAll()) return Ok("Save user Like sccuss");
            return BadRequest("Save user Like Error");
        }

    }
}