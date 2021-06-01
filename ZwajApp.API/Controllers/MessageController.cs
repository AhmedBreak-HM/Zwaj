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
    [Route("api/users/{userId}/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly IZwajRepository _repo;
        private readonly IMapper _mapper;
        public MessageController(IZwajRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet("{id}", Name = "GetMessage")]
        public async Task<IActionResult> GetMessage(int userId, int id)
        {
            var userIdFromToken = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            if (userIdFromToken != userId) return Unauthorized();

            var messageFromRepo = await _repo.GetMessage(id);
            if (messageFromRepo == null) return NotFound("this Message is not found");

            return Ok(messageFromRepo);
        }

        [HttpPost()]
        public async Task<IActionResult> CreateMessge(int userId, MessgeForCreationDto messgeForCreationDto)
        {
            var userIdFromToken = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            if (userIdFromToken != userId) return Unauthorized();
            messgeForCreationDto.SenderId = userId;
            var userFromRepo = await _repo.GetUser(messgeForCreationDto.RecipientId);
            if (userFromRepo == null) return NotFound(" This Recipient is not found in database");
            var messgeForCreated = _mapper.Map<Message>(messgeForCreationDto);
            _repo.Add<Message>(messgeForCreated);
            var userToReturn = _mapper.Map<MessgeForCreationDto>(messgeForCreated);
            if (await _repo.SaveAll())
                return CreatedAtRoute("GetMessage", new { id = messgeForCreated.Id }, userToReturn);
            return BadRequest("save message has error");
        }

    }
}