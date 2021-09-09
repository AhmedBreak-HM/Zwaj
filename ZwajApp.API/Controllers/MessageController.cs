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

        [HttpGet]
        public async Task<IActionResult> GetMessagesForUser(int userId, [FromQuery] MessageParams messageParams)
        {

            var userIdFromToken = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            if (userIdFromToken != userId) return Unauthorized();
            messageParams.UserId = userId;
            var messagesFromRepo = await _repo.GetMessagesForUser(messageParams);
            var messges = _mapper.Map<IEnumerable<MessageForReturnDto>>(messagesFromRepo);
            Response.AddApplicationPagenation(messagesFromRepo.CurrentPage, messagesFromRepo.PageSize,
                                              messagesFromRepo.Count, messagesFromRepo.TotlePages);

            return Ok(messges);


        }

        [HttpGet("{id}", Name = "GetMessage")]
        public async Task<IActionResult> GetMessage(int userId, int id)
        {
            var userIdFromToken = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            if (userIdFromToken != userId) return Unauthorized();

            var messageForDeleteDto = await _repo.GetMessage(id);

            if (messageForDeleteDto == null) return NotFound("this Message is not found");

            return Ok(messageForDeleteDto);
        }

        [HttpPost()]
        public async Task<IActionResult> CreateMessge(int userId, MessgeForCreationDto messgeForCreationDto)
        {
            var sender = await _repo.GetUser(userId);
            var userIdFromToken = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            if (sender.Id != userIdFromToken) return Unauthorized();
            messgeForCreationDto.SenderId = userId;
            var recipientFromRepo = await _repo.GetUser(messgeForCreationDto.RecipientId);
            if (recipientFromRepo == null) return NotFound(" This Recipient is not found in database");
            var messgeForCreated = _mapper.Map<Message>(messgeForCreationDto);
            _repo.Add<Message>(messgeForCreated);
            if (await _repo.SaveAll())
            {
                var messgeToReturn = _mapper.Map<MessageForReturnDto>(messgeForCreated);
                return CreatedAtRoute("GetMessage", new { id = messgeForCreated.Id }, messgeToReturn);

            }
            return BadRequest("save message has error");
        }

        [HttpGet("chat/{recipientId}")]
        public async Task<IActionResult> GetConversation(int userId, int recipientId)
        {
            var userIdFromToken = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            if (userIdFromToken != userId) return Unauthorized();

            var messagesFromRepo = await _repo.GetConversation(userId, recipientId);
            // foreach (var message in messagesFromRepo)
            // {
            //     if (message.IsRead == false && userIdFromToken == message.RecipientId)
            //     {
            //         message.IsRead = true;
            //         message.DateRead = DateTime.Now;
            //     }

            // }
            // await _repo.SaveAll();
            var messagesToReturn = _mapper.Map<IEnumerable<MessageForReturnDto>>(messagesFromRepo);

            return Ok(messagesToReturn);
        }
        [HttpGet("count")]
        public async Task<IActionResult> GetUnreadMessages(int userId)
        {
            var userIdFormToken = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            if (userIdFormToken != userId) return Unauthorized();

            var count = await _repo.GetUnReadMessage(userIdFormToken);
            return Ok(count);
        }

        [HttpPost("read/{id}")]
        public async Task<IActionResult> MarkMessageRead(int userId, int id)
        {

            var userIdFormToken = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            if (userIdFormToken != userId) return Unauthorized();

            var message = await _repo.GetMessage(id);
            if (message.RecipientId != userId) return Unauthorized();
            message.IsRead = true;
            message.DateRead = DateTime.Now;
            if (await _repo.SaveAll())
            {
                return StatusCode(201);
            }
            return BadRequest("this message cant update");

        }
        [HttpPost("{id}")]
        public async Task<IActionResult> DeleteMessage(int id, int userId)
        {

            var userIdToken = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            if (userIdToken != userId) return Unauthorized();
            var messageFromRepo = await _repo.GetMessage(id);
            // var messageForDeleteDto = _mapper.Map<MessageForDeleteDto>(messageFromRepo);
            if (messageFromRepo == null) return NotFound();

            if (messageFromRepo.SenderId == userId)
                messageFromRepo.SenderDeleted = true;
            if (messageFromRepo.RecipientId == userId)
                messageFromRepo.RecipientDeleted = true;
            if (messageFromRepo.RecipientDeleted && messageFromRepo.SenderDeleted)
                _repo.Delete(messageFromRepo);
            if (await _repo.SaveAll()) return Ok("message is deleted");
            throw new Exception("cant delete message ");
        }

    }
}